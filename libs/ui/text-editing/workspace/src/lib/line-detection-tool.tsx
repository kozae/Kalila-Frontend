import {
  selectAllTextElements,
  selectManyRegionDataUrlById,
  useAppSelector,
} from '@frontend/shared-ui';
import { createWorker, PSM } from 'tesseract.js';
import { useEffect } from 'react';

export const LineDetectionTool = () => {
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  const doDetection = async (url: string) => {
    await worker.load();
    await worker.loadLanguage('eng+osd');
    await worker.initialize('eng+osd');
    await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO_ONLY });
    const data = await worker.recognize(url);
    console.log(data);
  };
  const textElements = useAppSelector(selectAllTextElements);
  const urls = useAppSelector((state) =>
    selectManyRegionDataUrlById(
      state,
      textElements.map((el) => el._id)
    )
  );
  useEffect(() => {
    Object.values(urls).forEach(async (url) => {
      await doDetection(url);
    });
  }, [urls]);
  return <></>;
};
