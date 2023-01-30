import {
  type IndexApi,
  type Page,
  type StreamState,
} from "@ceramicnetwork/common";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { b64ToJSON } from "../utils/encoding";

export async function loadStreamsByModel({
  did,
  model,
  ceramic,
}: {
  did: string;
  model: string;
  ceramic: CeramicClient;
}): Promise<Record<string, any>> {
  let cursor: string | undefined;
  const chunkSize = 1000;
  const streams = {} as Record<string, any>;
  const index: IndexApi = ceramic.index;
  do {
    const indexFolderResponse: Page<StreamState> = await (!cursor
      ? index.queryIndex({
          account: did,
          model: model,
          last: chunkSize,
        })
      : index.queryIndex({
          account: did,
          model: model,
          last: chunkSize,
          before: cursor,
        }));
    for (const edge of indexFolderResponse.edges) {
      const streamId: string = b64ToJSON(edge.cursor)["stream_id"];
      if (edge.node.metadata.model == null) {
        continue;
      }
      streams[streamId] = edge.node.content;
    }

    const { hasPreviousPage, startCursor } = indexFolderResponse.pageInfo;
    if (hasPreviousPage) {
      cursor = startCursor;
    } else {
      cursor = undefined;
    }
  } while (cursor);
  return streams;
}
