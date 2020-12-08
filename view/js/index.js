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

  // Listen For Realtime Option Change
  $(document).on('realtime-change', function ({ isActive }) {
    if (isActive) {
      input.on('input', encodeInputText);
      output.on('input', decodeInputText);
    } else {
      input.off('input', encodeInputText);
      output.off('input', decodeInputText);
    }
  });

  // Read Options
  const useFastEncode = $('#use_fast_encode'),
    useFastDecode = $('#use_fast_decode');
  let isFastEncodeEnabled = false,
    isFastDecodeEnabled = false;

  useFastEncode.on('click', function () {
    // Turn Off Fast Decode
    if (isFastDecodeEnabled) useFastDecode.trigger('click');

    isFastEncodeEnabled = $(this).prop('checked');

    if (isFastEncodeEnabled) ipc.on(Events.BROWSER_FOCUSED, fastEncode);
    else ipc.off(Events.BROWSER_FOCUSED, fastEncode);

    modal.show({
      msg: `Fast Encode Is Now ${isFastEncodeEnabled ? 'On' : 'Off'}`,
      header: 'Fast Encode'
    });
  });

  useFastDecode.on('click', function () {
    // Turn Off Fast Encode
    if (isFastEncodeEnabled) useFastEncode.trigger('click');

    isFastDecodeEnabled = $(this).prop('checked');

    if (isFastDecodeEnabled) ipc.on(Events.BROWSER_FOCUSED, fastDecode);
    else ipc.off(Events.BROWSER_FOCUSED, fastDecode);

    modal.show({
      msg: `Fast Decode Is Now ${isFastDecodeEnabled ? 'On' : 'Off'}`,
      header: 'Fast Decode'
    });
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
});
