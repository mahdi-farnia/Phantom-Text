$(() => {
  const leftPanel = $('#left-panel');
  const leftPanelBaseClass = leftPanel.attr('class');
  const classList = {
    openPanel: 'open',
    goSetting: 'setting',
    goOptions: 'options',
    goSavedScripts: 'saved-scripts',
    goAbout: 'about-app',
    showManualTransferButton: 'use-manual-button-transfer'
  };

  // Toggle Left Panel Buttons
  const setting = 'nav_app-settings',
    options = 'nav_app-options',
    savedScript = 'nav_saved-script',
    about = 'nav_about-app';

  $('#menu').on('click', ({ target }) => {
    switch ($(target).attr('id')) {
      case setting:
        if (
          leftPanel.hasClass(classList.goSetting) &&
          leftPanel.hasClass(classList.openPanel)
        ) {
          leftPanel.removeClass(classList.openPanel);
          return;
        }

        leftPanel.attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goSetting}`
        );

        return;

      case options:
        if (
          leftPanel.hasClass(classList.goOptions) &&
          leftPanel.hasClass(classList.openPanel)
        ) {
          leftPanel.removeClass(classList.openPanel);
          return;
        }

        leftPanel.attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goOptions}`
        );
        return;

      case savedScript:
        if (
          leftPanel.hasClass(classList.goSavedScripts) &&
          leftPanel.hasClass(classList.openPanel)
        ) {
          leftPanel.removeClass(classList.openPanel);
          return;
        }

        leftPanel.attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goSavedScripts}`
        );
        return;

      case about:
        if (
          leftPanel.hasClass(classList.goAbout) &&
          leftPanel.hasClass(classList.openPanel)
        ) {
          leftPanel.removeClass(classList.openPanel);
          return;
        }

        leftPanel.attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goAbout}`
        );

        return;
    }
  });

  const $globalKeyInput = $('#global_key'),
    copyGlobalKey = 'copy_global_key',
    genKey = 'generate_key',
    toggleRealtimeTransfer = 'use_realtime_transfer',
    toggleWindowAlwaysOnTop = 'use_always-on-top',
    goSetting = 'dot_app-settings',
    goSavedScripts = 'dot_saved-script',
    goOptions = 'dot_options',
    goAbout = 'dot_about-app',
    $body = $(document.body);

  const RealtimeStatusEvent = new $.Event('realtime-change', {
    isActive: null
  });

  leftPanel.on('click', function ({ target }) {
    switch ($(target).attr('id')) {
      case copyGlobalKey:
        const val = $globalKeyInput.val().toString();

        if (val !== '') {
          clipboard.writeText(val);

          modal.show({
            header: 'Key',
            msg: 'Key Copied',
            duration: 1000
          });
        } else {
          modal.show({
            header: 'Key',
            msg: 'Nothing To Copy',
            duration: 1000
          });
        }
        return;

      case genKey:
        ipc.send(Events.GENERATE_KEY);
        return;

      case toggleRealtimeTransfer:
        let isActive = (RealtimeStatusEvent.isActive = $(target).prop(
          'checked'
        ));

        // Toggle Show Buttons
        if (isActive) {
          $body.removeClass(classList.showManualTransferButton);
        } else {
          $body.addClass(classList.showManualTransferButton);
        }

        modal.show({
          msg: `Text Transform Is Now ${isActive ? 'On' : 'Off'}`,
          header: 'Text Transform'
        });

        $(document).trigger(RealtimeStatusEvent);
        return;

      case toggleWindowAlwaysOnTop:
        let isOn = $(target).prop('checked');

        modal.show({
          msg: `Always On Top Is Now ${isOn ? 'On' : 'Off'}`,
          header: 'Always On Top'
        });

        ipc.send(Events.ALWAYS_ON_TOP_CHANGE, isOn);
        return;

      case goSetting:
        $(this).attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goSetting}`
        );
        return;

      case goSavedScripts:
        $(this).attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goSavedScripts}`
        );
        return;

      case goOptions:
        $(this).attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goOptions}`
        );
        return;

      case goAbout:
        $(this).attr(
          'class',
          `${leftPanelBaseClass} ${classList.openPanel} ${classList.goAbout}`
        );
        return;
    }
  });

  // Get Generated Key
  ipc.on(Events.GENERATED_KEY, (e, key) => {
    $globalKeyInput.val(key);
    $globalKeyInput.trigger('input');
  });
});
