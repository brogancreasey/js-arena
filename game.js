var WIDTH=800, HEIGHT=WIDTH;
		var clicks = 0;
		var projectiles = new Array();
		var atkmode = 0;
		var marks = new Array();

		function main(){
			init(WIDTH, HEIGHT);
			canvas.addEventListener("click", function(e){
				if(atkmode == 0){
					var p = new Projectile();
					p.x = player.x; p.y = player.y;
					p.destX = e.offsetX;
					p.destY = e.offsetY;
					p.angle = Math.atan2(e.offsetY - p.y, e.offsetX - p.x);
					projectiles.push(p);
				}
				else if(atkmode == 1){
					var atk = new Slash(player);
		          	atk.init(e.offsetX - player.x, e.offsetY - player.y, clicks%2);
		          	clicks++;
		          	attacks.push(atk);
	          	}
	          	else if(atkmode == 2){
	          		var n = new Mark();
	          		n.x = e.offsetX;
	          		n.y = e.offsetY;
	          		marks.push(n);
	          	}
			});

			ai.spawn();
			var loop = function(){
				arena.draw();
				player.update();
				ai.update();
				marks.forEach(function(elem){
		        	elem.draw();
		        });
				attacks.forEach(function(elem){
		          elem.draw();
		        });
				player.draw();
				ai.draw();
				projectiles.forEach(function(elem){
					elem.update();
					elem.draw();
				});
				checkForDead();
		        for(var i = attacks.length-1; i>=0; i--){
		          if(attacks[i].frames.length==0){
		            attacks.splice(i,1);
		          }
		        }
				window.requestAnimationFrame(loop,canvas);
			};
			window.requestAnimationFrame(loop, canvas);
		};

		function checkForDead(){
			for(var i = projectiles.length-1; i >= 0; i--){
				if(projectiles[i].destroy){
					projectiles.splice(i,1);
				}
			}
			for(var i = marks.length-1; i >= 0; i--){
				if(marks[i].destroy){
					marks.splice(i,1);
				}
			}
		}

		function Mark(){
			this.x = 0;
			this.y = 0;
			this.size = 20;
			this.cur_size = 0;
			this.lifetime = 120;
			this.explosionSize = 0;
			this.destroy = false;
			this.hit = false;
			this.draw = function(){
				if(!this.explode){
					if(this.cur_size != this.size)
						this.cur_size += 2;
					context.beginPath();
					context.arc(this.x, this.y, this.cur_size, 0, 2*Math.PI);
					context.closePath();
					context.strokeStyle = "#FF00F0";
					context.lineWidth = 10;
					context.stroke();
					this.lifetime--;
					if(this.lifetime == 0){
						this.explode = true;
					}
				}
				else{
					context.fillStyle = "#FF00F0";
					context.fillRect(this.x-this.explosionSize/2,this.y-this.explosionSize/2,this.explosionSize, this.explosionSize);
					this.explosionSize += 10;
					if(util.aabb_aabb(ai.x, ai.y, 10, 10, this.x-this.explosionSize/2,this.y-this.explosionSize/2,this.explosionSize, this.explosionSize) && !this.hit){
			          	this.hit = true;
			          	if(ai.current_health > 0)
			        		ai.current_health -= 50;
			        }
					if(this.explosionSize > 100)
						this.destroy = true;
				}
			}
		}
		
		function Projectile(){
			this.x = 0;
			this.y = 0;
			this.size = 5;
			this.angle = 0;
			this.speed = 1;
			this.destX = 0;
			this.destY = 0;
			this.exploding = false;
			this.destroy = false;
			this.hit = false;
			this.draw = function(){
				context.fillStyle = "#FF0000";
				if(this.exploding)
					this.size+=4;
				context.fillRect(this.x-this.size/2, this.y-this.size/2,this.size,this.size);
				if(this.size > 50){
					this.destroy = true;
				}
				if(util.aabb_aabb(ai.x, ai.y, 10, 10, this.x-this.size/2,this.y-this.size/2,this.size,this.size) && !this.hit){
					this.exploding = true;
		         	this.hit = true;
		       		if(ai.current_health > 0)
		        		ai.current_health -= 20;
		        }
			};
			this.update = function(){
				if(this.x < this.destX + 2 && this.x > this.destX - 2 && 
				   this.y < this.destY + 2 && this.y > this.destY - 2){
					this.exploding = true;
				}
				else{
					this.x += this.speed * Math.cos(this.angle);
					this.y += this.speed * Math.sin(this.angle);
				}
			}
		};



	var attacks = new Array();

      function Slash(parent){
        this.color = "#FFFF00";
        this.frames = new Array();
        this.prevFrames = new Array();
        this.parent = parent;
        this.angle = 0;
        this.hit = false;
        this.init = function(x, y, slashType){
          var frames = 8;
          this.angle = Math.atan2(y, x);
          var x = 0; y = 0;
          if(slashType == 0){
          	this.angle -= util.deg_to_rad(45);
          }
          for(var i = 0; i < frames; i++){
          	x = (slashType == 0) ? Math.cos(this.angle)*20 : x+Math.cos(this.angle)*5;
          	y = (slashType == 0) ? Math.sin(this.angle)*20 : y+Math.sin(this.angle)*5;
            this.frames.push({
              x: x,
              y: y
            });
            if(slashType == 0)
           		this.angle += Math.degToRad(90)/frames;
          };
        };
        this.draw = function(){
          var frame = this.frames.shift();
          var fX = frame.x, fY = frame.y,
              pX = this.parent.x,
              pY = this.parent.y;
         	context.fillStyle = this.color;
         	context.fillRect(fX+pX+5,fY+pY+5,6,6);
          var size = 2;
          this.prevFrames.forEach(function(elem){
           	context.fillRect(elem.x+pX+5,elem.y+pY+5,size,size);
            size += 0.5;
          });
          if(this.prevFrames.length > 3){
            this.prevFrames.shift();
          }
          this.prevFrames.push(frame);
          if(util.aabb_aabb(ai.x, ai.y, 10, 10, fX+pX+5,fY+pY+5, 6, 6) && !this.hit){
          	this.hit = true;
          	if(ai.current_health > 0)
          		ai.current_health -= 10;
          }
        };
      }


		var arena = {
			size: 300,
			draw: function(){
				context.fillStyle = "#FFF";
				context.fillRect(0,0,WIDTH,HEIGHT);
				context.fillStyle = "#784800";
				context.beginPath();
				context.arc(WIDTH/2, HEIGHT/2, arena.size, 0, 2*Math.PI);
				context.closePath();
				context.fill();
				context.lineWidth = 10;
				context.strokeStyle = "#777";
				context.stroke();

				var offset = 10;
				context.strokeStyle = "#DDD";
				for(var i = 0; i < 8; i++){
					context.beginPath();
					context.arc(WIDTH/2, HEIGHT/2, arena.size+offset, 0, 2*Math.PI);
					context.closePath();
					if(i%2==0)
						context.strokeStyle = "#CCC";
					else
						context.strokeStyle = "#DDD";
					context.stroke();
					offset+=10;
				}
				context.beginPath();
				context.arc(WIDTH/2, HEIGHT/2, arena.size+offset, 0, 2*Math.PI);
				context.closePath();
				context.strokeStyle = "#EEE";
				context.lineWidth = 20;
				context.stroke();
				context.strokeStyle = "#111";

				context.fillRect(WIDTH/2-40, 0, 80, HEIGHT);
				context.fillRect(0, WIDTH/2-40, WIDTH, 80);
			}
		};
		var player = {
			x: 300, y: 300,
			draw: function(){
				context.fillStyle = "#FFF";
				context.fillRect(this.x,this.y,10,10);
			},
			update: function(){
				hWidth = WIDTH/2;
				if((keystate[KEY.UP]    || keystate[KEY.W])
					&& distFromCenter(this.x,this.y-3, hWidth, hWidth) < arena.size*arena.size) this.y-=3;
				if((keystate[KEY.DOWN]  || keystate[KEY.S])
					&& distFromCenter(this.x,this.y+3, hWidth, hWidth) < arena.size*arena.size) this.y+=3;
				if((keystate[KEY.LEFT]  || keystate[KEY.A])
					&& distFromCenter(this.x-3,this.y, hWidth, hWidth) < arena.size*arena.size) this.x-=3;
				if((keystate[KEY.RIGHT] || keystate[KEY.D])
					&& distFromCenter(this.x+3,this.y, hWidth, hWidth) < arena.size*arena.size) this.x+=3;
				if(keystate[KEY.KEY1])
					atkmode = 0;
				if(keystate[KEY.KEY2])
					atkmode = 1;
				if(keystate[KEY.KEY3])
					atkmode = 2;
			}		
		}
		var ai = {
			health: 150,
			current_health: 150,
			x: 200, y: 200,
			spawn_point: 0,
			inArena: false,
			draw: function(){
				context.fillStyle = "#AFA";
				context.fillRect(this.x,this.y,10,10);
				context.fillStyle = "#FF0000";
				var hbar = util.scale_to_range(this.current_health, 0, this.health, 0, 10);
				context.fillRect(this.x,this.y-6, hbar, 4);
			},
			update: function(){
				if(this.current_health <= 0)
					ai.spawn();
				hWidth = WIDTH/2;
				if(distFromCenter(this.x,this.y, hWidth, hWidth) < (arena.size-40)*(arena.size-40) && distFromCenter(this.x,this.y,player.x,player.y) > 20*20){
						this.inArena = true;
						var angle = Math.atan2(player.y-this.y, player.x-this.x);
						this.x += 0.5 * Math.cos(angle);
						this.y += 0.5 * Math.sin(angle);
				}									
				if(!this.inArena){
						this.enterArena();
				}
			},
			spawn: function(){
				this.current_health = this.health;
				this.inArena = false;
				this.spawn_point = Math.floor((Math.random() * 4) + 1);
				switch(this.spawn_point){
					case 1: this.x = 0; this.y = HEIGHT/2;
						break;
					case 2: this.x = WIDTH/2; this.y = 0;
						break;
					case 3: this.x = WIDTH-10; this.y = HEIGHT/2;
						break;
					case 4: this.x = WIDTH/2; this.y=HEIGHT;
						break;
				}
			},
			enterArena: function(){
				switch(this.spawn_point){
					case 1: this.x++;
						break;
					case 2: this.y++;
						break;
					case 3: this.x--;
						break;
					case 4: this.y--;
						break;
				}
			}
		}
		var ui = {
			draw: function(){
				context.fillStyle = "#333";
				context.fillRect(0,HEIGHT-50,WIDTH,50);
				context.fillStyle = "#111";
				context.font = "20px sans-serif";
				context.lineWidth = 2;
				var xOffset = 100;
				for(var i=0;i<10;i++){
					context.fillStyle = "#000"
					context.strokeText("Skill "+(i+1),xOffset,HEIGHT - 20);
					context.fillStyle = "#FFF";
					context.fillText("Skill "+(i+1),xOffset,HEIGHT - 20);
					xOffset +=	context.measureText("Skill "+(i+1)).width + 5;
				}
			}
		};

		function distFromCenter(ax,ay,bx,by){
			return (ax-bx)*(ax-bx) + (ay-by)*(ay-by); 
		}
		main();