import React from 'react';
import FileUploader from 'devextreme-react/file-uploader';
import { withRouter } from 'react-router-dom';


class LargeUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chunks: [] };
    this.allowedFileExtensions = ['.jpg', '.jpeg', '.tif', '.tiff']; //'.jpg', '.jpeg', '.tif', '.png'
    this.onUploadProgress = this.onUploadProgress.bind(this);
    this.onUploadStarted = this.onUploadStarted.bind(this);
    this.checkFileFormat = this.checkFileFormat.bind(this);
    this.routeChange = this.routeChange.bind(this);
    this.onFilesUploaded = this.onFilesUploaded.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <FileUploader
          name="file"
          accept="image/*"
          dialogTrigger="#dropzone-external"
          dropZone="#dropzone-external"
          uploadUrl={`${process.env.REACT_APP_API_URL}/user/largeUpload/${this.props.getUUID}`}
          allowedFileExtensions={this.allowedFileExtensions}
          chunkSize={3000000}
          onUploadStarted={this.onUploadStarted}
          onProgress={this.onUploadProgress}
          onFilesUploaded={this.onFilesUploaded}
          multiple={true}
          visible={false}
          id="file-uploader"
          onValueChange={this.checkFileFormat}
        />
      </React.Fragment>
    );
  }

  // redirect to make order
  onFilesUploaded(e) {
    this.routeChange();
  }
  routeChange() {
    let path = `/makeOrder`;
    this.props.history.push(path);
  }
  // check file format and error handling
  checkFileFormat(e) {
    const allImages = e
    allImages.forEach(element => {
      if (element.type === 'image/jpeg' || element.type === 'image/tiff') {
        this.props?.setTypeError(false);
      }
      else {
        this.props?.setTypeError(true);
      }
    });
  }

  onUploadProgress(e) {
    const chunk = {
      segmentSize: e.segmentSize,
      bytesLoaded: e.bytesLoaded,
      bytesTotal: e.bytesTotal,
    };
    this.setState({ chunks: [...this.state.chunks, chunk] });
    // this.setState({ progressValue: (e.bytesLoaded / e.bytesTotal) * 100 });

    this.props.setLoading(true);
    this.props.setCounter(Number((e.bytesLoaded / e.bytesTotal) * 100).toFixed(0))
    // this.props.setCounter(parseInt(document.getElementsByClassName('dx-progressbar-status')[0].innerHTML)
    if (e.bytesLoaded === e.bytesTotal) {
      this.props.setConfigSession(JSON.parse(e.request.response));
      this.props.setShowIcons(true);
      this.props.setLoading(false);

    }
  }

  onUploadStarted() {
    this.props.setLoading(true);
    this.setState({ chunks: [] });
  }

  getValueInKb(value) {
    return `${(value / 1024).toFixed(0)}kb`;
  }
}

export default withRouter(LargeUpload);
