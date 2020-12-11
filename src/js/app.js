const { ipcRenderer: ipc } = require('electron');
const { join: joinPath } = require('path');
const Events = require(joinPath(__dirname, '../modules/Events.js'));
const { clipboard } = navigator;
// Use For Shortcuts
const Keys = {
  command_control: ''
};

$(() => {
  // Get Info
  ipc.send(Events.APP_LOADED);
  ipc.once(Events.SYSTEM_INFO, (e, { isDarwin }) => {
    Keys.command_control = isDarwin ? 'Command' : 'Ctrl';
  });

  const input = $('#encode_field');
  const output = $('#output_field');
  let copyTextToClipboard = false;

  const keyInput = $('#global_key');
  let globalKey;

  keyInput.on('input', function () {
    const val = $(this).val().toString();

    if (val.trim() !== '') {
      globalKey = val;
      ipc.send(Events.REGISTER_KEY, val);
      encodeInputText.call(input);
    }
  });

  // Real time encode
  input.on('input', encodeInputText);
  output.on('input', decodeInputText);

  // Prevent Behaviour & Shortcuts
  const TabKey = '  ';

  $(input)
    .add(output)
    .on('keydown', function (e) {
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          const val = $(this).val().toString(),
            { selectionStart, selectionEnd } = this;

          this.value = `${val.slice(0, selectionStart)}${TabKey}${val.slice(
            selectionEnd
          )}`;

          this.selectionStart = this.selectionEnd =
            selectionEnd + TabKey.length;
          return;

        case 'Enter':
          if (e.shiftKey && useManualTransferButton) {
            e.preventDefault();
            encodeInputText.call($(this));
          }
          return;
      }
    });

  // Header Actions
  const encodeHeader = $('#encode_header'),
    decodeHeader = $('#decode_header'),
    useFastEncode = 'use_fast_encode',
    manualEncodeButton = 'encode_manual-encode',
    copyEncoded = 'encode_field_copy',
    useFastDecode = 'use_fast_decode',
    manualDecodeButton = 'decode_manual-encode',
    copyDecoded = 'decode_field_copy',
    clearEncoded = 'encode_field_clear',
    clearDecoded = 'decode_field_clear';
  // Read Options
  let isFastEncodeEnabled = false,
    isFastDecodeEnabled = false,
    useManualTransferButton = false;

  // Header
  encodeHeader.on('click', ({ target }) => {
    const $target = $(target);

    switch ($target.attr('id')) {
      case useFastEncode:
        useFastEncodeHandler.call($target);
        return;

      case manualEncodeButton:
        if (useManualTransferButton) encodeInputText.call(input);
        return;

      case copyEncoded:
        const val = input.val().toString();
        if (val) {
          clipboard.writeText(val);

          modal.show({
            msg: 'Field Copied',
            header: 'Encode',
            duration: 1500
          });
        } else {
          modal.show({
            msg: 'Nothing To Copy',
            header: 'Encode',
            duration: 1500
          });
        }

        return;

      case clearEncoded:
        input.val('');

        modal.show({ msg: 'Field Cleared', header: 'Encode', duration: 1500 });
        return;
    }
  });

  decodeHeader.on('click', ({ target }) => {
    const $target = $(target);
    switch ($target.attr('id')) {
      case useFastDecode:
        useFastDecodeHandler.call($target);
        return;

      case manualDecodeButton:
        if (useManualTransferButton) decodeInputText.call(output);
        return;

      case copyDecoded:
        const val = output.val().toString();

        if (val) {
          clipboard.writeText(val);
          modal.show({ msg: 'Field Copied', header: 'Decode', duration: 1500 });
        } else {
          modal.show({
            msg: 'Nothing To Copy',
            header: 'Decode',
            duration: 1500
          });
        }

        return;

      case clearDecoded:
        output.val('');

        modal.show({ msg: 'Field Cleared', header: 'Decode', duration: 1500 });
        return;

      default:
        return;
    }
  });

  // Listen For Realtime Option Change
  $(document).on('realtime-change', function ({ isActive }) {
    if (isActive) {
      input.on('input', encodeInputText);
      output.on('input', decodeInputText);
      useManualTransferButton = false;
    } else {
      input.off('input', encodeInputText);
      output.off('input', decodeInputText);
      useManualTransferButton = true;
    }

    ipc.send(Events.SET_MINIMUM_SIZE, { isLarger: useManualTransferButton });
  });

  // Get Encode
  ipc.on(Events.GET_ENCODED, (e, { data, error }) => {
    if (copyTextToClipboard) {
      if (!error) {
        clipboard.writeText(data);

        modal.show({
          msg: 'Text Encoded',
          header: 'Fast Encode',
          duration: 1500
        });
      } else {
        modal.show({
          msg: 'Cannot Encode Text',
          header: 'Encode Error'
        });
      }

      copyTextToClipboard = false;

      return;
    }

    output.val(data);
  });

  // Get Decode
  ipc.on(Events.GET_DECODED, (e, { data, error }) => {
    copyTextToClipboard = false;

    // If Non-UTF-8 Decoded Prevent Copy -> ""
    if (error) {
      modal.show({
        header: 'Decode Error',
        msg: "Cannot Decode Text\nIt May Use Another Key Or It's Invalid"
      });

      return;
    }

    if (copyTextToClipboard) {
      clipboard.writeText(data);

      modal.show({
        msg: 'Text Decoded',
        header: 'Fast Decode',
        duration: 1500
      });

      return;
    }

    input.val(data);
  });

  /** Fn */

  /**
   * @param {'encode' | 'decode'} which
   * @param {any} data
   */
  function requestTransform(which, data) {
    if (globalKey) {
      switch (which) {
        case 'encode':
          ipc.send(Events.REQUEST_ENCODE, data);
          return;

        case 'decode':
          ipc.send(Events.REQUEST_DECODE, data);
          return;
      }
    } else {
      modal.show({
        header: 'Transform Error',
        msg: 'Please Enter Key First\nYou Can Enter Key In Setting'
      });
    }
  }

  function encodeInputText() {
    const txt = $(this).val().toString();

    requestTransform('encode', txt);
  }

  function decodeInputText() {
    const txt = $(this).val().toString();

    requestTransform('decode', txt);
  }

  async function fastEncode() {
    const data = await clipboard.readText();

    requestTransform('encode', data);

    copyTextToClipboard = true;
  }

  async function fastDecode() {
    const data = await clipboard.readText();

    requestTransform('decode', data);

    copyTextToClipboard = true;
  }

  function useFastEncodeHandler() {
    // Turn Off Fast Decode
    if (isFastDecodeEnabled) {
      const fastDecodeCheckbox = $('#' + useFastDecode);
      fastDecodeCheckbox.prop('checked', false);
      useFastDecodeHandler.call(fastDecodeCheckbox);
    }

    isFastEncodeEnabled = this.prop('checked');

    if (isFastEncodeEnabled) ipc.on(Events.BROWSER_FOCUSED, fastEncode);
    else ipc.off(Events.BROWSER_FOCUSED, fastEncode);

    modal.show({
      msg: `Fast Encode Is Now ${isFastEncodeEnabled ? 'On' : 'Off'}`,
      header: 'Fast Encode'
    });
  }

  function useFastDecodeHandler() {
    // Turn Off Fast Encode
    if (isFastEncodeEnabled) {
      const fastEncodeCheckbox = $('#' + useFastEncode);
      fastEncodeCheckbox.prop('checked', false);
      useFastEncodeHandler.call(fastEncodeCheckbox);
    }

    isFastDecodeEnabled = this.prop('checked');

    if (isFastDecodeEnabled) ipc.on(Events.BROWSER_FOCUSED, fastDecode);
    else ipc.off(Events.BROWSER_FOCUSED, fastDecode);

    modal.show({
      msg: `Fast Decode Is Now ${isFastDecodeEnabled ? 'On' : 'Off'}`,
      header: 'Fast Decode'
    });
  }
});
