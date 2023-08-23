# A Interactive Visualization Suite for the Perfomance Analysis of Semantic Segmentation Models 
Visualization for Machine Learning (CSGY-9223) Spring 2023 Final Project 

Current system: [Traingles Observable](https://observablehq.com/d/dbbe4c5c7a893c39)
Abstract: 
    The ability to efficiently draw meaningful conclusions in model performance for semantic segmentation tasks enables practitioners to prioritize model selection and improvement. Current state-of-the-art research in semantic segmentation commonly demonstrate model capabilities through use of mean intersection over union (mIoU) metric and the raw segmentation map prediction. A formative study is done with Machine Learning researchers at New York University who work in semantic segmentation. The study indicates that while these metrics are standard, they can obscure meaningful insights in the underlying prediction distribution, in the confusion between classes, and they fail to offer a way to directly connect this criterion with raw prediction data. This work aims to overcome these issues through the creation of an interactive visualization suite to analyze and compare performance of semantic segmentation models. Triangles presents common performance metrics for semantic segmentation alongside class- and categorical-level prediction distribution information in a synthesized format. The visualization technique is model-agnostic, as it can be used to compare the performance of a model regardless of its architecture. Triangles circumvents the abstraction of failure cases from commonly used metrics and analysis tools used in model performance evaluation.


Folder set up:
1. triangles.ipynb will access raw data uploaded to this github to compare underlying distribution of models
2. The tools folder is a catch all for model output files, output images, and the .js file used to plot triangles.
3. semseg.js plots overays multiple models against eachother while semseg_sing.js only displays a single model.
4. Visualization_input holds the input files used for creating the visualizations
