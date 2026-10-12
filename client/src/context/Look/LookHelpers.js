export const isVideo = (url) => /\.(mp4|webm|mov|ogg)$/i.test(url);


export const normalizeSizes = (sizes) => {
  if (!sizes) return [];

  
  const list = Array.isArray(sizes) ? sizes : [sizes];
  const result = [];

  list.forEach((item) => {
    if (typeof item !== "string") return;

  
    item.split(",").forEach((part) => {
    
      const size = part.trim().toLowerCase().replace(/\s+/g, "");

  
      if (size && !result.includes(size)) {
        result.push(size);
      }
    });
  });

  return result;
};

export const formatImgSrc = (path) => {
  if (!path) return null;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(cleanPath);
};