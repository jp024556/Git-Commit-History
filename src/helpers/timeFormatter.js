import RelativeTime from "@yaireo/relative-time";

export const timeFormatter = (_date) => {
  const relativeTime = new RelativeTime();
  return relativeTime.from(new Date(_date));
};
