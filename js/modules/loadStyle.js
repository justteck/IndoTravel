// load style
const styles = new Map();

const loadStyle = url => {
  if (styles.has(url)) {
    return styles.get(url);
  }

  const stylePromise = new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.append(link);

    link.addEventListener('load', () => {
      resolve();
    });
  });

  styles.set(url, stylePromise);

  return stylePromise;
};

export {
  loadStyle,
};
