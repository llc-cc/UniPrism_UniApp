import { getMajorSpeedTemplate } from './major-speed-data'

function sectionToPage(section, index, total, courseTitle) {
  return {
    title: section.title,
    role: `第 ${index + 1}/${total} 节`,
    content: [
      ...(section.formula
        ? [{ type: 'paragraph', text: section.formula }]
        : []),
      ...(section.paragraphs || []).map((text) => ({ type: 'paragraph', text })),
      ...(section.imageSrc
        ? [{
            type: 'figure',
            imageSrc: section.imageSrc,
            imageAlt: section.imageAlt || section.title,
            caption: section.title,
          }]
        : []),
    ],
    courseTitle,
  }
}

export function getMajorCourseReader(majorId, courseId, level = 'foundation') {
  const template = getMajorSpeedTemplate(majorId)
  if (!template) return null

  let article = null
  if (level === 'foundation') {
    article = (template.foundationArticles || []).find((item) => item.id === courseId)
  } else {
    article = (template.deepDiveArticles || []).find((item) => item.id === courseId)
  }
  if (!article || !Array.isArray(article.sections)) return null

  const pages = article.sections.map((section, index) =>
    sectionToPage(section, index, article.sections.length, article.title),
  )

  return {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    summary: article.summary,
    pages,
  }
}
