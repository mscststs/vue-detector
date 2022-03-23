export function mapVueComponentChildern(component, callback){
  const childrens = component.$children;
  childrens.forEach((child) => {
    callback(child);
    mapVueComponentChildern(child, callback);
  });
}