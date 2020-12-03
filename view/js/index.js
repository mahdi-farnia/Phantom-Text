const { ipcRenderer: ipc } = require('electron');
const { join: joinPath } = require('path');
const Events = require(joinPath(__dirname, '../modules/Events.js'));
const encoder = new TextEncoder();
const { clipboard } = navigator;

$(() => {
  const input = $('#encode_field');
  const output = $('#output_field');

  // Real time encode
  input.on('input', encodeInputText);

  // Read Options
  const useFastEncode = $('#use_fast_encode');

  useFastEncode.on('click', function () {
    const isFastModeEnabled = $(this).prop('checked');

    if (isFastModeEnabled) {
      ipc.on(Events.BROWSER_FOCUSED, fastEncode);
    } else {
      ipc.off(Events.BROWSER_FOCUSED, fastEncode);
    }
  });

  /** Fn */

  function encodeInputText() {
    const encoded = encoder.encode($(this).val().toString());

    output.val(encoded.toString());
  }

  // Encode Clipboard Data On App Actiavte And Copy
  async function fastEncode() {
    const data = await clipboard.readText();

    clipboard.writeText(encoder.encode(data).toString());
  }
});
