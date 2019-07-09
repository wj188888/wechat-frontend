let instance
export default {
  bind: function (el, binding, vnode) {
    let defaultConfig = {
      theme: 'ios',
      lang: 'zh',
      display: 'bottom',
      focusOnClose: false,
      onSet: function (event, inst) {
        let child = binding.expression
        if (child) {
          let expressions
          let hasChild = child.indexOf('.') > -1
          if(hasChild){
            expressions = binding.expression.split('.')
            child = expressions[0]
          }
          if (child in vnode.context.$data) {
            if(hasChild){
              vnode.context.$data[expressions[0]][expressions[1]] = inst.getVal()
            }else{
              vnode.context.$data[binding.expression] = inst.getVal()
            }
          } else {
            throw new Error('Directive v-' + binding.name + " can not take more than 1 argument")
          }
        } else {
          throw new Error('Directive v-' + binding.name + " must take value")
        }
      }
    }
    if(vnode.context[binding.arg]){
      defaultConfig = Object.assign({}, defaultConfig, vnode.context[binding.arg])
    }
    vnode.context.$nextTick(()=>{
      instance = mobiscroll.select(el, defaultConfig)
      if(binding.arg){
        vnode.context.$watch(binding.arg, (newVal) => {
          if(newVal){
            instance.option(newVal)
          }
        })
      }
      el.value = binding.value
      instance.setVal(binding.value, true)
    })
  },
  update: function (el, binding, vnode) {
    if(binding.value){
      vnode.context.$nextTick(()=>{
        el.value = binding.value
        instance.setVal(binding.value, true)
      })
    }
  },
  unbind: function () {}
}