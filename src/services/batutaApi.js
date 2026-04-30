import { Platform } from 'react-native';

export const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Erro ao buscar dados da API.');
  }

  return data?.data;
}

export async function getLessonsWithModules() {
  const lessons = await request('/lessons');

  const lessonsWithModules = await Promise.all(
    lessons.map((lesson) => request(`/lessons/${lesson.slug}`)),
  );

  return lessonsWithModules.map((lesson) => ({
    lesson: String(lesson.number),
    show_lesson: String(lesson.isActive),
    _id: String(lesson.id),
    progress: 'true',
    items: lesson.modules.map((module) => ({
      id: String(module.id),
      title: module.title,
      icon: module.icon,
      content: module.contentKey,
      practiceRoute: module.practiceRoute,
      unlockLevel: module.unlockLevel,
    })),
  }));
}

export async function getModuleByContentKey(contentKey) {
  const lessons = await request('/lessons');

  const lessonsWithModules = await Promise.all(
    lessons.map((lesson) => request(`/lessons/${lesson.slug}`)),
  );

  for (const lesson of lessonsWithModules) {
    const module = lesson.modules.find(
      (item) => String(item.contentKey) === String(contentKey),
    );

    if (module) {
      return module;
    }
  }

  return null;
}

export async function getActivityBySlug(slug) {
  return request(`/activities/${slug}`);
}

export async function startActivityBySlug(slug) {
  return request(`/activities/${slug}/start`);
}