public with sharing class GetSurveyScores {
    @AuraEnabled(cacheable=true)
    public static Customer_Survey__c  getScores(String caseId){
        Customer_Survey__c cs = [Select Id, Case__c, CSAT__c, Effort__c, NPS__c from Customer_Survey__c where Case__c =: caseId LIMIT 1];
        return cs;
    }
  
}
