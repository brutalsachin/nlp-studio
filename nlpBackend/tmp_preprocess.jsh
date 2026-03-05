import com.example.nplbackend.service.PreprocessingService;
import com.example.nplbackend.dto.PreprocessingRequest;
import com.example.nplbackend.model.NormalizationType;
var s = new PreprocessingService();
var r = new PreprocessingRequest();
r.setText("I absolutely loved the running scenes in the movie this movie is best in this world");
r.setNormalization(NormalizationType.STEMMING);
r.setRemoveStopwords(true);
r.setLowercase(true);
r.setRemovePunctuation(true);
r.setRemoveNumbers(false);
var out = s.preview(r);
System.out.println(out.getProcessedText());
/exit
