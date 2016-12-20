class InterfaceManipulator {
    constructor() {
        this.nameControl = null;
        this.classControl = null;
        this.entitySubmit = null;
        this.classSubmit = null;
        this.provisoryClassArray = [];

        this.localInitSettings();
    }

    localInitSettings() {
        var t = this;
        t.controlDefinition();
        t.userInputObtained();
        t.fillProvisoryClassArray();
    }

    getVersionRelease(){
        var t = this;
        var currentVersion = stateManager.getCurrentVersion();
        return currentVersion;
    }

    controlDefinition() {
        var t = this;
        t.nameControl = $('.js_name-input');
        t.classControl = $('.js_class-input');
        t.entitySubmit = $('.js_sumbit_new_element');
        t.classSubmit = $('.js_class-button');
    }


    usetInputObtained() {
        var t = this;
        var result = null;
        t.entitySubmit.on('click', function () {
          eventDirector.userInteraction();
        });
        return result;
      }


    fillProvisoryClassArray(){
        var t = this;
        t.classSubmit.on('click',function () {
            var newProvisoryClass = t.classControl.val();
            t.provisoryClassArray.push(newProvisoryClass);
        });
      }

    provisoryClassArrayIteration(targetedArray){
        var t = this;
        for(let value of t.provisoryClassArray){
            targetedArray.push(value);
        }
    }

    getStructureEntityName() {
        var t = this;
        var structureEntityName = t.nameControl.val();
        return structureEntityName;
    }


    getUserData(){
      var newStructureEntity = new StructureEntity();
      newStructureEntity.setUniqueName(t.getStructureEntityName());
      newStructureEntity.setcoreID(1);
      newStructureEntity.setVersionID(t.getVersionRelease());
      t.provisoryClassArrayIteration(newStructureEntity.classArray);
      newStructureEntity.pushToAttrMap(1,'aireemDA');
      newStructureEntity.setMotherStructure('mama');
      result = newStructureEntity;
      console.log(newStructureEntity);
      console.log(newStructureEntity.getSingleMapAttr(1))
      console.log(newStructureEntity.getAllSingleMapAttrPairs());
    }




}
