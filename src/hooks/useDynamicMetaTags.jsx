import { useEffect } from 'react';

const useDynamicMetaTags = ({ title, description, image }) => {
  useEffect(() => {
    const docTitle = document.title;
    document.title = title; // Set the title dynamically

    // Update meta tags
    const metaTags = [
      { name: 'title', content: title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      // Add other relevant meta tags
    ];

    const existingMetaTags = document.head.querySelectorAll('meta');
    const updatedMetaTags = [];

    // Update existing meta tags or create new ones
    existingMetaTags.forEach((metaTag) => {
      const foundMetaTag = metaTags.find(
        (newMetaTag) => newMetaTag.name === metaTag.name || newMetaTag.property === metaTag.name,
      );

      if (foundMetaTag) {
        metaTag.content = foundMetaTag.content;
        updatedMetaTags.push(metaTag);
      } else {
        document.head.removeChild(metaTag);
      }
    });

    // Create new meta tags that weren't found in existing ones
    metaTags.forEach((metaTag) => {
      if (!updatedMetaTags.find((updated) => updated === metaTag)) {
        const newMetaElement = document.createElement('meta');
        newMetaElement.setAttribute('name', metaTag.name || metaTag.property);
        newMetaElement.setAttribute('content', metaTag.content);
        document.head.appendChild(newMetaElement);
      }
    });

    return () => {
      document.title = docTitle; // Restore original title
      // Remove any dynamically added meta tags
      updatedMetaTags.forEach((metaTag) => document.head.removeChild(metaTag));
    };
  }, [title, description, image]); // Re-run when any of these change
};

export default useDynamicMetaTags;
