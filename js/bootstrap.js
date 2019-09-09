
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.bundle.js', {scope: '/'})
    .then(function(reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
      // registration failed
      console.log('Gosh Darn it! Registration failed with ' + error);
    });
  }
