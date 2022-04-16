function pointAxisAlignedBoundingBox(point, aabb) {
  return (
    Math.inRange(point.x, aabb.minX, aabb.maxX) &&
    Math.inRange(point.y, aabb.minY, aabb.maxY)
  );
}

function pointCircle(pointA, pointB, radius) {
  return (
    Math.euclidDistanceSquare(pointA.x, pointA.y, pointB.x, pointB.y) <
    Math.pow(radius, 2)
  );
}

function circleCricle(pointA, radiusA, pointB, radiusB) {
  const totalRadius = Math.pow(radiusA, 2) + Math.pow(radiusB, 2);
  return (
    Math.euclidDistanceSquare(pointA.x, pointA.y, pointB.x, pointB.y) <
    totalRadius
  );
}

function aabbAABB(aabbA, aabbB) {
  return (
    Math.rangeOverlap(aabbA.minX, aabbA.maxX, aabbB.minX, aabbB.maxX) &&
    Math.rangeOverlap(aabbA.minY, aabbA.maxY, aabbB.minY, aabbB.maxY)
  );
}
