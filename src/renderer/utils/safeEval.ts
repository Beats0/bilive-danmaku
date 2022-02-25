import vm, { Context, RunningScriptOptions } from 'vm';

export default function safeEval(
  code: string,
  context?: Context,
  opts?: RunningScriptOptions
) {
  const sandbox: Context = {};
  const resultKey = `SAFE_EVAL_${Math.floor(Math.random() * 1000000)}`;
  sandbox[resultKey] = {};
  const clearContext = `
    (function(){
      Function = undefined;
      const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
      keys.forEach((key) => {
        const item = this[key];
        if(!item || typeof item.constructor !== 'function') return;
        this[key].constructor = undefined;
      });
    })();
  `;
  code = `${clearContext + resultKey}=${code}`;
  if (context) {
    Object.keys(context).forEach(function(key) {
      sandbox[key] = context[key];
    });
  }
  vm.runInNewContext(code, sandbox, opts);
  return sandbox[resultKey];
}
