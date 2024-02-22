export default function(object: { [id: string]: any }) {
  if (!object) {
    object = {};
  }
  return Object.keys(object).map(id => object[id]);
}
