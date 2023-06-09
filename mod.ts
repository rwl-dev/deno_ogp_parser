import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

type MetaDataType = string | null | undefined;

export interface MetaData {
  title: MetaDataType;
  description: MetaDataType;
  favicon: MetaDataType;
  open_graph: {
    title: MetaDataType;
    description: MetaDataType;
    site_name: MetaDataType;
    type: MetaDataType;
    url: MetaDataType;
    image: MetaDataType;
  };
  twitter: {
    title: MetaDataType;
    description: MetaDataType;
    card: MetaDataType;
    image: MetaDataType;
    site: MetaDataType;
  };
}

/**
 * Extract meta data in fetched HTML data
 * @param url URL
 * @returns parsed object
 */
export const parsedMeta = async (url: string): Promise<MetaData> => {
  const res = await fetch(url);
  const bodyReader = await res.body?.getReader().read();
  const decoder = new TextDecoder();
  const body = new DOMParser().parseFromString(
    decoder.decode(bodyReader?.value),
    "text/html",
  );

  const metaData: MetaData = {
    title: null,
    description: null,
    favicon: null,
    open_graph: {
      title: null,
      description: null,
      site_name: null,
      type: null,
      url: null,
      image: null,
    },
    twitter: {
      title: null,
      description: null,
      card: null,
      image: null,
      site: null,
    },
  };

  metaData.title = body?.querySelector("title")?.innerText;

  body?.querySelectorAll("link").forEach((node) => {
    const element = node as Element;
    if (element.getAttribute("rel") === "shortcut icon") {
      metaData.favicon = element.getAttribute("href");
    }
  });

  body?.querySelectorAll("meta").forEach((node) => {
    const element = node as Element;

    if (element.getAttribute("name") === "description") {
      metaData.description = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:title") {
      metaData.open_graph.title = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:description") {
      metaData.open_graph.description = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:site_name") {
      metaData.open_graph.site_name = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:type") {
      metaData.open_graph.type = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:url") {
      metaData.open_graph.url = element.getAttribute("content");
    }
    if (element.getAttribute("property") === "og:image") {
      metaData.open_graph.image = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:title") {
      metaData.twitter.title = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:description") {
      metaData.twitter.description = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:card") {
      metaData.twitter.card = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:image") {
      metaData.twitter.image = element.getAttribute("content");
    }
    if (element.getAttribute("name") === "twitter:site") {
      metaData.twitter.site = element.getAttribute("content");
    }
  });

  return metaData;
};
