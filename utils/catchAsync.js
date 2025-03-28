/**
 * This function is a middleware that will catch any error that is thrown
 * from the function that is passed to it, and pass the error to the next
 * middleware in the stack.
 *
 * This is useful for handling errors that happen in async code, because
 * errors that are thrown in async code will not be caught by a try/catch
 * block.
 *
 * @param {Function} fn - The function that may throw an error.
 * @return {Function} - A middleware that will catch any error from the
 *   function that is passed to it and pass the error to the next middleware
 *   in the stack.
 */
exports.catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
}