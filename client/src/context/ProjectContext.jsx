import { createContext, useContext, useState ,useEffect} from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [stack, setStack] = useState("");
  const [features, setFeatures] = useState([]);
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    title: "",
    description: "",
  });

  const [generatedFile, setGeneratedFile] = useState(null);

  // Load from localStorage when app starts
  useEffect(() => {
    const storedFile = localStorage.getItem("generatedFile");
    if (storedFile) {
      setGeneratedFile(JSON.parse(storedFile));
    }
  }, []);

  // Save to localStorage when generatedFile changes
  useEffect(() => {
    if (generatedFile) {
      const { url, ...rest } = generatedFile; // strip url
      localStorage.setItem("generatedFile", JSON.stringify(rest));
    }
  }, [generatedFile]);


  return (
    <ProjectContext.Provider
      value={{ stack, setStack, features, setFeatures, projectInfo, setProjectInfo, generatedFile, setGeneratedFile }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
