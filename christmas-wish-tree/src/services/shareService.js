// Generate a share link and copy clipboard

export const ShareService = {
  generateShareId: () => Math.random().toString(36).substr(2, 9),

  createShareURL: (shareId) => `${window.location.origin}/#/tree/${shareId}`,

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older 브라우저
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    }
  },
};
