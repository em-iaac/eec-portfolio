// Warms the lazy EXPLORE chunk (called from the mode link's hover/focus and
// at the start of the mode transition) so the toggle lands on a ready scene.
export const preloadExplore = () => import('./ExplorePage')
