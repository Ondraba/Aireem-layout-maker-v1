class PropsPanelUI{
    constructor() {
        //options
        this.localOptions = propsPanelOptions;
        //cross class legacy
        this.favourites = this.localOptions.getPropsPanelOptions().creativeArea.favourites;
        //constructed areas
        this.propsPanelMain = null;
        this.customPropsPanel = null;
        //constructed controlls
        this.propsManipulator = null;
        //init methods and listeners
        this.initSequence();
      }

  initSequence(){
    var t = this;
    //init methods
    t.propsPanelAreas();
    t.fillPropsPanel();


    //listeners
    t.propsPanelReaction();
    t.customPropsPanelReaction();
  }

  propsPanelAreas(){
    var t = this;
    //areas
    t.propsPanelMain = $('.favourites-area');
    t.customPropsPanel = $('.custom-props-area');
    //controlls
    t.propsManipulator = ".standard-props-box";
    t.customPropsManipulator =  ".custom-props-box";
  }


  newPropertyHTML(appendArea, secondLevelObj, item, source, baseClass, version){
    var t = this;
    var newProp =  $(document.createElement('div'));
    var newPropText =  $(document.createElement('span'));
      newProp.addClass(baseClass.replace('.',''));
      newProp.attr('versionID', version);
    if(secondLevelObj != 'none'){
      newPropText.text(source[secondLevelObj][item]);
      }
    else{
      newPropText.text(item);
    }
      newProp.append(newPropText);
      appendArea.append(newProp);
  }

  fillPropsPanel(){
      var t = this;
      var activeProps = t.localOptions.getActiveProps();
      if (activeProps.length != 0){
      for(let secondLevelObj of activeProps){
          if (t.favourites[secondLevelObj].length != 0){
            for(let i = 0; i < t.favourites[secondLevelObj].length; i++){
              t.newPropertyHTML(t.propsPanelMain, secondLevelObj, i, t.favourites, t.propsManipulator, 'beforeVersionConfirm');
              }
        }
          else throw new Error('There is some inconsistency in PropsPanelOptions setting');
      }
    }
    else  throw new Error('There are no favourites selected in PropsPanelOptions');
  }


  propsPanelReaction(){
        var t = this;
        $(document).on('click',t.propsManipulator,function (){
          var propertyValue = $(this).children('span').text();
          var editModeState = stateManager.getCurrentEditModeState();
          console.log('klik');
            if(editModeState == null){
              throw new Error('There is some error in State Manager processing.');
            }
            else if (editModeState == false) {
              t.propertySelected(propertyValue, 'Before confirm version release.');
            }
            else{
              t.propertySelected(propertyValue, stateManager.getGlobalVersionRelease());
            }
        });
  }

  customPropsPanelReaction(){
    var t = this;
    var propertyValue = null;
    $(document).on('click',t.customPropsManipulator,function (){
      var propertyValue = $(this).children('span').text();
      for(var i = 0; i < dataTranslator.provisoryClassHolder.length; i++){
        if (dataTranslator.provisoryClassHolder[i] == propertyValue){
          dataTranslator.provisoryClassHolder.splice(i,1);
        }
      }
      if(propertyValue != null){
        t.rerenderCustomProps();
      }
      else {
        throw new Error('There is some error in CustomPropsPanel or ProvisoryClassHolder');
      }
    });
  }



  propertySelected(propertyValue, version){
    var t = this;
    dataTranslator.setItemToProvisoryClassHolder(propertyValue);
    t.rerenderByNewProperty(version);
  }

  customPropertyAreaClear(){
    var t = this;
    t.customPropsPanel.empty();
  }

  rerenderByNewProperty(version){
    var t = this;
    t.customPropertyAreaClear();
    for(let item of dataTranslator.provisoryClassHolder){
      t.newPropertyHTML(t.customPropsPanel, 'none', item, dataTranslator.provisoryClassHolder, t.customPropsManipulator, version);
    }
  }

  rerenderCustomProps(){
    var t = this;
    console.log('custom props nove'+ dataTranslator.provisoryClassHolder);
    t.customPropertyAreaClear();
      for(var i = 0; i < dataTranslator.provisoryClassHolder.length; i++){
        var newCustomPropsPanel = $(document.createElement('div'));
        newCustomPropsPanel.attr('versionID', stateManager.getGlobalVersionRelease());
        var newCustomPropsPanelText = $(document.createElement('span'));
        let replacedClass = t.customPropsManipulator.replace('.','');
        newCustomPropsPanel.addClass(replacedClass);
        console.log('class' + t.customPropsManipulator);
        newCustomPropsPanelText.text(dataTranslator.provisoryClassHolder[i]);
        newCustomPropsPanel.append(newCustomPropsPanelText);
        t.customPropsPanel.append(newCustomPropsPanel);
    }
  }

}
