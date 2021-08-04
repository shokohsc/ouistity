const errorsHistory = [];
function abortErrorReport(message, file, line, column, error) {

    // Close the log behind a rollout mechanism to protect your infrastructure
    if (!errorLoggingEnabled) return true;

    // Limit the amount of errors from one page
    if (errorsHistory.length > 10) return true;

    // Send the same error twice from the same page can create false multiplications
    if (errorsHistory.includes(message)) return true;
    errorsHistory.push(message);

    // A page may be considered stale if it's been open for over, lets say, an hour
    if (window.performance.now() > 36e5) return true;

    // Add more rules that suit your consideration

    return false;
}

/**
 * This is the signature of the browser's built in onerror handler
 * @param  {string} message Error message
 * @param  {string} file    Source file where the script threw an error
 * @param  {number} line    Line number
 * @param  {number} column  Column number
 * @param  {Error}  error   Error object
 * @return {Boolean}        Should the default event handler fire?
 */
export default function myOnErrorHandler(message, file, line, column, error) {
  if(abortErrorReport(...args)) {
      return;
  }

  const record = {
      message,
      file,
      line,
      column,
      stack: error.stack,
      name: error.name,
  };

  record.metadata = {

      url: document.location.href,
      referrer: document.referrer,
      cookie: navigator.cookieEnabled ? document.cookie : 'disabled',
      language: navigator.language,
      connection: navigator.connection.effectiveType,
      hasFocus: document.hasFocus(),
      readyState: document.readyState,
      secondsIn: Math.round(performance.now() / 1000), // page age in seconds
      heap: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB of heap used
      heapPercent: Math.round(performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100), // Percent of heap used
  };

  console.log(record);
};



// const { headers } = request;
//
// const request_metadata = {
//     user_agent: headers['user-agent'],
//     ip: headers['true-client-ip'], // provided by DNS service
//     country: headers['cf-ipcountry'], // Cloudflare provides GeoIP for free!
//     is_known_crawler: isbot(headers['user-agent']),
//     referrer: headers.referer,
// };
