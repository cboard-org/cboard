export function getBreakpointFromWidth(breakpoints, width) {
  const sortBreakpoints = breakpoints => {
    let keys = Object.keys(breakpoints);
    return keys.sort((a, b) => breakpoints[a] - breakpoints[b]);
  };

  const sorted = sortBreakpoints(breakpoints);
  let matching = sorted[0];

  for (let i = 1, len = sorted.length; i < len; i++) {
    let breakpointName = sorted[i];
    if (width > breakpoints[breakpointName]) matching = breakpointName;
  }

  return matching;
}
