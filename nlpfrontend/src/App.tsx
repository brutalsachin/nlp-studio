import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './about';
import UploadData from './UploadData';
import Preprocessing from './preprocessing';
import FeatureExtraction from './featureExtraction';
import Vectorization from './vectorization';
import NlpPipelineVisual from './nlpPipelineVisual';
import ModelSelection from './modelSelection';
import Evaluation from './evaluation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<UploadData />} />
        <Route path="/preprocessing" element={<Preprocessing />} />
        <Route path="/feature-extraction" element={<FeatureExtraction />} />
        <Route path="/vectorization" element={<Vectorization />} />
        <Route path="/pipeline-visual" element={<NlpPipelineVisual />} />
        <Route path="/model-selection" element={<ModelSelection />} />
        <Route path="/evaluation" element={<Evaluation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;