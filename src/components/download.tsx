import { useDownloadGeneratedFile } from "../hooks/download-file";
import "./download.css";
import { v4 as uuidv4 } from "uuid";

export default function Download() {
  const { isDownloading, error, downloadFile } = useDownloadGeneratedFile();

  return (
    <>
      <div className="buttons">
        <div>
          <button onClick={() => downloadFile()}>Download immediately</button>
        </div>
        <div>
          <button
            onClick={() =>
              downloadFile({ filename: `${uuidv4()}.bin`, timeout: 1_000 })
            }
          >
            Download with timeout
          </button>
        </div>
        <div>
          <button onClick={() => downloadFile({ shouldFail: true })}>
            Trigger download error
          </button>
        </div>
        <div>
          <button
            onClick={() => downloadFile({ shouldFailWithNonError: true })}
          >
            Trigger non-Error download error
          </button>
        </div>
      </div>
      <div className="download-status">
        {isDownloading && <p>Downloading...</p>}
        {error && <p>Error: {error}</p>}
      </div>
    </>
  );
}
