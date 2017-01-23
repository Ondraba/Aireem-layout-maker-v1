class EditPanelUI{
  constructor() {
        //options
        this.localEditsPanelOptions = null;

        this.currentActiveItem = null;
        this.stayOnItem = null;

        //cross class instances

        //constructed areas
        this.editPanel = null;

        ///constructed controlls
        this.editActivator = null;
        this.editManipulator = null;
        this.editControl = null;

        //init methods and listerners
        this.initSequence();
    }


//Edit init settings and areas/controlls
  initSequence(){
    var t = this;
    //init methods
    t.editPanelAreas();

    //listeners
    t.editElementSelected();
    t.editRemoveConfirm();
    t.activateEditMode();
    t.setInitState();
  }

  editPanelAreas(){
    var t = this;
    //areas
    t.editPanel = $('.edit-panel-main');
    //controlls
    t.editActivator = ".js_selectableDiv";
    t.editManipulator = ".js_edit_prop_box";
    t.editControl = ".js_switch_to_edit";
  }
//Edit init settings and controlls

setInitState(){
  var t = this;
  $(t.editControl).text('Zapnout editaci');
}

activateEditMode(){
  var t = this;
  $(t.editControl).on('click',function () {
    if(stateManager.getCurrentEditModeState() == false){
    stateManager.setEditMode();
    $(this).text('Vypnout editaci');
    }
    else{
      stateManager.disableEditMode();
      t.unsetStayOnItem();
      t.setInitState();
      controlPanelUI.clearMotherElement();
    }
  });
}

setStayOnItem(item){
  var t = this;
  t.stayOnItem = item;
}

unsetStayOnItem(){
  var t = this;
  t.stayOnItem = null;
}

getStayOnItem(){
  var t = this;
  return t.stayOnItem;
}

switchToStandardMode(){
 console.log('editace vypnuta');
}


getCurrentActiveItem(){
  var t = this;
  return t.currentActiveItem;
}

setCurrentActiveItem(item){
  var t = this;
  t.currentActiveItem = item;
}

targetCoreItem(activatedBy){
  var t = this;
  var targetItem = null;
  for(var i = 0; i < dataTranslator.coreStructureHolder.length; i++){
      if (dataTranslator.coreStructureHolder[i].getVersionID() == $(activatedBy).attr('versionID')){
        targetItem = dataTranslator.coreStructureHolder[i];
        if(t.getStayOnItem() == null){
        t.setCurrentActiveItem(targetItem);
        }
      }
    }
    if (targetItem != null){
      return targetItem;
    }
    else throw new Error('There is some inconsistency between core items and core items props.');
}



removeCoreItem(){
  var t = this;
  var itemToRemove = t.getCurrentActiveItem();
  var index = dataTranslator.coreStructureHolder.indexOf(itemToRemove);
  dataTranslator.coreStructureHolder.splice(index,1);
  dataTranslator.rerenderPreview();
}

//core edit methods
  editElementSelected(){
    var t = this;
    $(document).on('click', t.editActivator,function (e){
      if (!e) var e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();

      controlPanelUI.clearProvisoryClassArray();
      t.editPanelClear();

      propsPanelUI.customPropertyAreaClear();
      let targetCoreItem = t.targetCoreItem(this);
      controlPanelUI.setNewMotherElement(targetCoreItem.getMotherStructure());
       //event propagation settings - document.captureEvents(Event.CLICK); vs on('click') bubbling
          if(stateManager.getCurrentEditModeState() == true){
            if(t.getStayOnItem() == null){
              stateManager.setGlobalVersionRelease($(this).attr('versionID'));
              t.editPanelRerender(targetCoreItem);
              t.setStayOnItem($(this).attr('coreid'));
              }
            else{
              t.motherElementSelected($(this).attr('coreid'));
              var existingStructureEntity = editPanelUI.getCurrentActiveItem();
              existingStructureEntity.setMotherStructure(controlPanelUI.getMotherElement());
              console.log('structure is here' + dataTranslator.coreStructureHolder);
              dataTranslator.rerenderPreview();
              }
          }
          else{
            t.motherElementSelected($(this).attr('coreid'));
          }
      });
  }

  motherElementSelected(newMotherElement){
    var newMotherElementCheck = parseInt(newMotherElement);
    if(typeof newMotherElementCheck === "number" && newMotherElement > 0){
      $("div[coreid='" + newMotherElementCheck + "']").addClass('selectedMotherElement');
      controlPanelUI.setNewMotherElement(newMotherElementCheck);
    }
    else{
       throw new Error('There is some error in coreid system');
    }
  }

  editRemoveConfirm(){
    var t = this;
      $(document).on('click',t.editManipulator,function (){
          let targetCoreItem = t.targetCoreItem(this);
          for(var x = 0; x < targetCoreItem.classArray.length; x++){
            if(targetCoreItem.classArray[x] == $(this).children('span').text()){
                targetCoreItem.classArray.splice(x,1);
                t.editPanelRerender(targetCoreItem);
                dataTranslator.rerenderPreview();
              }
            }
      });
  }

  editPanelRerender(coreElementToEdit){
    var t = this;
      t.editPanelClear();
    for(let item of coreElementToEdit.classArray){
      var newEditPropsPanel = $(document.createElement('div'));
      var newEditPropsPanelText = $(document.createElement('span'));
      newEditPropsPanel.attr('versionID',coreElementToEdit.getVersionID());
      newEditPropsPanel.addClass('js_edit_prop_box');
      newEditPropsPanelText.text(item);
      newEditPropsPanel.append(newEditPropsPanelText);
      t.editPanel.append(newEditPropsPanel);
    }
  }

  editPanelClear(){
    var t = this;
    t.editPanel.empty();
  }
//core edit methods


}
