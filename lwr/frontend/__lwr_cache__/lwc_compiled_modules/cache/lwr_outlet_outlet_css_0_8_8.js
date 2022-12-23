function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return "div[role='region']" + shadowSelector + " {outline: none;}";
  /*LWC compiler v2.17.0*/
}
export default [stylesheet];