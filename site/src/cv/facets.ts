// The CV graph view's kind facets (G2 model, relocated G3). Lives apart from
// CareerGraph.tsx so CV.tsx can validate the ?facet= URL param without
// statically importing the lazy graph chunk.
export type CareerFacet = 'projects' | 'thoughts' | 'milestones'

export const isCareerFacet = (v: string | null): v is CareerFacet =>
  v === 'projects' || v === 'thoughts' || v === 'milestones'
