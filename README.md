
<div align="center"><h1>NavigatorAI</h1></div>

</div>

<div align="center"><h2>Description</h2></div>

&emsp;&emsp;NavigatorAI is an intelligent travel itinerary planning system powered by large language models and multi-source data integration. The system allows users to input a destination city and travel duration, and dynamically generates a personalized travel itinerary. From retrieving scenic spots and local cuisines to generating detailed plans in HTML and PDF formats, NavigatorAI offers an efficient, intelligent, and user-friendly way to plan trips.

</div>

<div align="center"><h2>Demonstration</h2></div>

![image-demo](https://s2.loli.net/2024/12/22/vYXlPNgwK4sAhzU.png)

&emsp;&emsp;Experience the system’s capabilities online through our demo interface. Click here to explore 👉 [NavigatorAI Demo](#)

</div>

<div align="center"><h2>Todo</h2></div>

- [ ] Enhance the frontend UI for better user experience
- [ ] Add more comprehensive APIs for third-party integrations
- [ ] Expand database for more cities and cuisines
- [ ] Implement a multilingual interface
- [ ] Add a feature for group travel itinerary generation

</div>

<div align="center"><h2>Quick Start</h2></div>

<details open>
    <summary><h4>Installation</h4></summary>


&emsp;&emsp;To get started with NavigatorAI, you need to install `conda` as your Python runtime environment. It is recommended to use `miniconda`.

&emsp;&emsp;1. Create a virtual `conda` environment:

```bash
$ conda create -n NavigatorAI python==3.10 # NavigatorAI is the name of your environment
$ conda activate NavigatorAI
```

&emsp;&emsp;2. Install required dependencies:

```bash
$ git clone https://github.com/fengju0213/NavigatorAI && cd NavigatorAI 
$ pip install -r requirements.txt
```

</details>

<details open>
    <summary><h4>Preparation</h4></summary>


&emsp;&emsp;1. Open the `.env.example` file and fill in your API Keys for LLM and search engines. Then rename it to `.env`:

```
GOOGLE_API_KEY = ""
SEARCH_ENGINE_ID = ""
OPENAI_API_KEY = ""
```

&emsp;&emsp;2. Make sure to set up Flask and run the application:

```bash
$ python app.py
```

</details>

</div>

<div align="center"><h2>References</h2></div>

1. [Flask Documentation](https://flask.palletsprojects.com/)
2. [Google Search API Documentation](https://developers.google.com/custom-search)
3. [DuckDuckGo API](https://duckduckgo.com/params)
4. [Large Language Models by modelscope](https://modelscope.cn/)
5. [Camel Hackathon](https://camel-ai-24h-hackathon.devpost.com/)
</div>

<div align="center"><h2>Acknowledgements</h2></div>

&emsp;&emsp;***I sincerely thank my teammates and collaborators for their hard work, insightful feedback, and contributions that shaped this project into its current form.***

- [@fengju0213](https://github.com/fengju0213)
- [@Tsumugii24](https://github.com/Tsumugii24)
- [@jjyaoao](https://github.com/jjyaoao)
- [@jiaohuix](https://github.com/jiaohuix)

</div>

<div align="center"><h2>Contact</h2></div>

Feel free to open GitHub issues or directly email us if you have any questions about this project. 
