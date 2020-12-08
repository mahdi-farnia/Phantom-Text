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

  // Real time encode
  input.on('input', encodeInputText);
  output.on('input', decodeInputText);

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
        clipboard.writeText(input.val().toString());

        modal.show({
          msg: 'Field Copied',
          header: 'Encode',
          duration: 1500
        });
        return;

      case clearEncoded:
        input.val('');

        modal.show({ msg: 'Field Cleared', header: 'Encode', duration: 1500 });
        return;

      default:
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
        clipboard.writeText(output.val().toString());

        modal.show({ msg: 'Field Copied', header: 'Encode', duration: 1500 });
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
      // if input was empty
      if (!error) {
        clipboard.writeText(data);

        modal.show({
          msg: 'Text Encoded',
          header: 'Fast Encode',
          duration: 2000
        });
      }

      copyTextToClipboard = false;

      return;
    }

    output.val(data);
  });

  // Get Decode
  ipc.on(Events.GET_DECODED, (e, { data, error }) => {
    if (copyTextToClipboard) {
      // If Non-UTF-8 Decoded Prevent Copy -> ""
      if (!error) {
        clipboard.writeText(data);

        modal.show({
          msg: 'Text Decoded',
          header: 'Fast Decode',
          duration: 2000
        });
      }

      copyTextToClipboard = false;

      return;
    }

    input.val(data);
  });

  /** Fn */

  function encodeInputText() {
    const txt = $(this).val().toString();

    ipc.send(Events.REQUEST_ENCODE, txt);
  }

  function decodeInputText() {
    const txt = $(this).val().toString();

    ipc.send(Events.REQUEST_DECODE, txt);
  }

  async function fastEncode() {
    const data = await clipboard.readText();

    ipc.send(Events.REQUEST_ENCODE, data);

    copyTextToClipboard = true;
  }

  async function fastDecode() {
    const data = await clipboard.readText();

    ipc.send(Events.REQUEST_DECODE, data);

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
