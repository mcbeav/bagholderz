import { debounce } from "./debounce";
import { calculateHeight } from "./calculateHeight";

const viewport = debounce( calculateHeight, 100 );

module.exports = {viewport}