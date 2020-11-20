import { LightningElement, wire, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import GAUGE_CHART from '@salesforce/resourceUrl/Charts';
import GET_SURVEY_RESULTS from '@salesforce/apex/GetSurveyScores.getScores';

export default class CSAT_Indicator extends LightningElement {
    elements;
    @api recordId;
    csat;
    nps;
    effort;
    scores = [];
    error;

    @wire(GET_SURVEY_RESULTS, { caseId: '$recordId' })
    getData({ error, data }) {
        if (data) {
            Promise.all([
                loadScript(this, GAUGE_CHART + "/dist/bundle.js"),
                loadStyle(this, GAUGE_CHART + "/dist/styles.css")
            ])
                .then(() => {
                    console.log("Chart JS file loaded successfully");
                    this.csat = data.CSAT__c;
                    this.nps = data.NPS__c;
                    this.effort = data.Effort__c;
                    this.scores.push((this.csat/5)*100);
                    this.scores.push((this.effort/7) * 100);
                    this.scores.push((this.nps/10) * 100);
                    this.getElement();
                    this.error = undefined;
                })
                .catch((error) => {
                    console.log(error);
                });
            console.log(JSON.stringify(data));
        }
        else if (error) {
            this.error = error;
            console.log(error);
        }
    }

    get title() {
        return 'Customer Surveys';
    }

    getElement() {
        let width = this.template.querySelector('.container').offsetWidth/3;
        this.elements = this.template.querySelectorAll('.gaugeChart');
        console.log(this.element);
        let gaugeOptions = {
            // needle options
            hasNeedle: true,
            outerNeedle: false,
            needleColor: 'black',
            needleStartValue: 0,
            needleUpdateSpeed: 1000,
            // arc options
            arcColors: ['#009fe3', '#2763a7', '#123662'],
            arcDelimiters: [33.33, 66.66],
            arcPadding: 0,
            arcPaddingColor: 'white',
            arcLabelFontSize: false,
            //arcOverEffect: false,
            // label options
            rangeLabelFontSize: false,
            labelsFont: 'sans-serif',
        }
        this.elements.forEach((element,index) => {
            GaugeChart.gaugeChart(element, width, gaugeOptions).updateNeedle(this.scores[index]);
        })
    }

}