export const renderTextWithFirstWordColored = (text: string, restColorClass: string = "text-text-body") => {
  const firstSpaceIndex = text.indexOf(" ");
  if (firstSpaceIndex === -1) {
    return <span className={restColorClass}>{text}</span>;
  }
  const firstWord = text.substring(0, firstSpaceIndex);
  const rest = text.substring(firstSpaceIndex);
  return (
    <>
      <span className="text-primary-dark">{firstWord}</span>
      <span className={restColorClass}>{rest}</span>
    </>
  );
};

export const truncateWithEllipsis = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};
