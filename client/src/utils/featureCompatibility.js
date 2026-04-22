export const featureCompatibility = {
  mern: ['auth', 'docker', 'github', 'linting', 'deployment', 'tailwind', 'readme', 'env'],
  nextjs: ['auth', 'docker', 'github', 'linting', 'deployment', 'tailwind', 'readme', 'env'],
  'node-express': ['auth', 'docker', 'github', 'linting', 'deployment', 'readme', 'env'],
  django: ['auth', 'docker', 'github', 'linting', 'deployment', 'readme', 'env'],
  'spring-boot': ['auth', 'docker', 'github', 'linting', 'deployment', 'readme', 'env'],
  flask: ['auth', 'docker', 'github', 'linting', 'deployment', 'readme', 'env'],
  'full-stack-ts': ['auth', 'docker', 'github', 'linting', 'deployment', 'tailwind', 'readme', 'env'],
  'react-native': ['auth', 'docker', 'github', 'linting', 'deployment', 'readme', 'env'],
};

export function isFeatureSupported(stackId, featureId) {
  return Boolean(featureCompatibility[stackId]?.includes(featureId));
}
