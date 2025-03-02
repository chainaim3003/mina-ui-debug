import { Field, SelfProof, ZkProgram, verify, Struct, Int64 } from 'o1js';

class Point extends Struct({ x: Field, y: Field }) {
  static add(a: Point, b: Point) {
    return { x: a.x.add(b.x), y: a.y.add(b.y) };
  }
}

class Points8 extends Struct({
  points: [Point, Point, Point, Point, Point, Point, Point, Point],
}) {}

const main = async () => {

console.log(' points ref main ...');

const point1 = { x: Field(10), y: Field(4) };
const point2 = { x: Field(1), y: Field(2) };

const pointSum = Point.add(point1, point2);

console.log(`pointSum Fields: ${Point.toFields(pointSum)}`);

const points = new Array(8)
  .fill(null)
  .map((_, i) => ({ x: Field(i), y: Field(i * 10) }));
const points8: Points8 = { points };

console.log(`points8 JSON: ${JSON.stringify(points8)}`);

//let points8String  = points8.points.forEach.toString();
//console.log(`points8String:`, points8String);

let cumulIndex = 5; let cumulValue = Int64.from(0);

for (let index = 0; index < cumulIndex; index++) {
  let element = points8.points[index];
  let elementVal = element.y.toJSON();
  
  let elementInt = Int64.from(elementVal);

  cumulValue = Int64.from(cumulValue.add(elementInt));
  console.log('element', element.x.toJSON(), element.y.toJSON(),' elementVal .. ' , elementVal , ' cumulValue', cumulValue.magnitude.toJSON())
}
console.log(' cumulValue',cumulValue.magnitude.toJSON())

}
main();
