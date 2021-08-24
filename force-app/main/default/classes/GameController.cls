public with sharing class GameController {

    //wrapper class
    public class Filters {
        @AuraEnabled
        public String searchKey {set;get;}
        @AuraEnabled
        public Decimal maxPrice {set;get;}
        @AuraEnabled
        public String[] game_tabs {set;get;}
        @AuraEnabled
        public String[] languages {set;get;}

    }

    @AuraEnabled(Cacheable=true)
    public static List<Game__c> getGames(Filters filters) {//make sure the method parameter name is the same as component parameter
        String key, whereClause = '';
        Decimal maxPrice;
        String[] game_tabs, languages, criteria= new List<String>{};

        if(filters !=null){
            maxPrice = filters.maxPrice;
            game_tabs = filters.game_tabs;
            languages = filters.languages;
            if(!String.isEmpty(filters.searchKey)){
                key =  '%'+filters.searchKey+'%';
                criteria.add('Name LIKE: key');
            }
            if(filters.maxPrice >= 0){
                criteria.add('Price__c <= :maxPrice');
            }
            if(filters.game_tabs !=null){
                criteria.add('Game_Tab__c IN :game_tabs');
            }
            if(filters.languages !=null){
                criteria.add('Language__c IN :languages');
            }
            if(criteria.size()>0){
                whereClause =  'WHERE ' + String.join(criteria, ' AND ');
            }
        }
        system.debug('Criteria is ' + criteria);
        String query = 'SELECT Id, Name, Price__c, Description__c, Game_Tab__c, Language__c, Picture_URL__c FROM Game__c ' + whereClause + ' WITH SECURITY_ENFORCED ORDER BY NAME';
        return Database.query(query);
    }
}
