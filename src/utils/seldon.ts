export const parseQuestionsAndOptions = (afterSuggestions: string) => {
  const questionsArray = afterSuggestions.trim().split('\n');
  const cleanedQuestionsArray = questionsArray.map((question) =>
    question
      .trim()
      .replace(/^-*\s*/, '')
      .replace(/^\d+\.\s*/, ''),
  ); // Remove leading hyphens, spaces, and numbers with dots

  // Function to check if an option is related to "Others"
  const isOtherOption = (option: string) => /^(others?|other)$/i.test(option);

  // Process each question
  const processedQuestions = cleanedQuestionsArray.map((question) => {
    // Use regular expression to extract the part inside the parentheses
    const questionText = question.replace(/\(.*\)/, '').trim(); // Remove the part inside parentheses for the question
    const optionsMatch = question.match(/\(([^)]+)\)/); // Extract the part inside parentheses

    let optionsArray: string[] = [];
    let userCanAddOption = false;

    if (optionsMatch) {
      const optionsString = optionsMatch[1].trim();
      // Split options by various delimiters
      if (optionsString.includes('/')) {
        optionsArray = optionsString.split('/').map((option) => option.trim());
      } else if (optionsString.includes(',')) {
        optionsArray = optionsString.split(',').map((option) => option.trim());
      } else {
        optionsArray = optionsString.split(/\s+/).map((option) => option.trim());
      }

      // Check for "Others" options and update userCanAddOption
      if (optionsArray.some(isOtherOption)) {
        userCanAddOption = true;
        optionsArray = optionsArray.filter((option) => !isOtherOption(option));
      }
    }

    // Determine postType
    const postType =
      optionsArray.length === 2 && optionsArray.every((option) => /^(yes|no)$/i.test(option))
        ? 'yes/no'
        : 'multipleChoice';

    return {
      question: questionText,
      options: optionsArray,
      postType,
      userCanAddOption,
    };
  });

  return processedQuestions;
};

export const processPromptResponse = (promptResponse: string) => {
  // Define a regex pattern to match any line containing "poll" or "suggestions"
  const removalRegex = /\b(poll|suggestions?)\b/i;

  // Split the input into lines
  const lines = promptResponse.split('\n');

  let foundPollOrSuggestion = false;
  let beforePollOrSuggestions = [];
  let afterPollOrSuggestions = [];

  // Iterate over lines and divide before/after the "poll" or "suggestions" line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!foundPollOrSuggestion && !removalRegex.test(line)) {
      // Add lines to "before" until we find a match
      beforePollOrSuggestions.push(line);
    } else if (removalRegex.test(line)) {
      // When the "poll" or "suggestions" line is found, stop adding to "before" and mark as found
      foundPollOrSuggestion = true;
    } else if (foundPollOrSuggestion) {
      // Add lines to "after" once we have found the "poll" or "suggestions" line
      afterPollOrSuggestions.push(line);
    }
  }

  // Join the "before" and "after" parts, trimming any leading or trailing whitespace
  const beforeText = beforePollOrSuggestions.join('\n').trim();
  const afterText = afterPollOrSuggestions.join('\n').trim();

  return {
    before: beforeText,
    after: afterText,
  };
};

export function extractSections(markdown: string) {
  const titlePattern = /^(.*?(Title|TITLE|title)\s*:\s*)(.*?)(\*\*|$)/im;
  const abstractPattern = /\*\*Abstract:\s*([\s\S]*?)(?=\n\*\*Findings:)/;
  const findingsPattern = /\*\*Findings:\s*([\s\S]*)/;

  const titleMatch = markdown.match(titlePattern);
  const abstractMatch = markdown.match(abstractPattern);
  const findingsMatch = markdown.match(findingsPattern);

  const title = titleMatch ? titleMatch[3].trim() : null;
  let abstract = abstractMatch ? abstractMatch[1].trim() : null;
  abstract = abstract ? abstract.replace(/^\**\s*/, '').trim() : null;
  let findings = findingsMatch ? findingsMatch[1].trim() : null;
  findings = findings ? findings.replace(/^\**\s*/, '').trim() : null;

  return {
    title,
    abstract,
    findings,
  };
}
