import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@layouts/AppLayout';
import { ExplorerPage } from '@pages/ExplorerPage';
import { ComparisonPage } from '@pages/ComparisonPage';
import { DashboardPage } from '@pages/DashboardPage';
import { RecommendPage } from '@pages/RecommendPage';
import { CompareButton } from '@components/CompareButton';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ExplorerPage />} />
          <Route path="/dashboards" element={<DashboardPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
        <CompareButton />
      </AppLayout>
    </Router>
  );
}

export default App;
