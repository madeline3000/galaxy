"use strict";define(["layout/generic-nav-view","mvc/webhooks","utils/localization","utils/utils"],function(t,e,i,l){return{Collection:Backbone.Collection.extend({model:Backbone.Model.extend({defaults:{visible:!0,target:"_parent"}}),fetch:function(o){o=o||{},this.reset();var s=new t.GenericNavView;this.add(s.render()),this.add({id:"analysis",title:i("Analyze Data"),url:"",tooltip:i("Analysis home view")}),this.add({id:"workflow",title:i("Workflow"),tooltip:i("Chain tools into workflows"),disabled:!Galaxy.user.id,url:"workflow"}),this.add({id:"shared",title:i("Shared Data"),url:"library/index",tooltip:i("Access published resources"),menu:[{title:i("Data Libraries"),url:"library/list"},{title:i("Histories"),url:"histories/list_published"},{title:i("Workflows"),url:"workflows/list_published"},{title:i("Visualizations"),url:"visualizations/list_published"},{title:i("Pages"),url:"pages/list_published"}]}),this.add({id:"visualization",title:i("Visualization"),url:"visualizations/list",tooltip:i("Visualize datasets"),disabled:!Galaxy.user.id,menu:[{title:i("New Track Browser"),url:"visualization/trackster",target:"_frame"},{title:i("Saved Visualizations"),url:"visualizations/list",target:"_frame"},{title:i("Interactive Environments"),url:"visualization/gie_list",target:"galaxy_main"}]}),e.add({url:"api/webhooks/masthead/all",callback:function(t){$(document).ready(function(){$.each(t.models,function(t,e){var i=e.toJSON();if(i.activate){var o={id:i.name,icon:i.config.icon,url:i.config.url,tooltip:i.config.tooltip,onclick:i.config.function&&new Function(i.config.function)};Galaxy.page?Galaxy.page.masthead.collection.add(o):Galaxy.masthead&&Galaxy.masthead.collection.add(o),l.appendScriptStyle(i)}})})}}),Galaxy.user.get("is_admin")&&this.add({id:"admin",title:i("Admin"),url:"admin",tooltip:i("Administer this Galaxy"),cls:"admin-only"});var a={id:"help",title:i("Help"),tooltip:i("Support, contact, and community"),menu:[{title:i("Support"),url:o.support_url,target:"_blank"},{title:i("Search"),url:o.search_url,target:"_blank"},{title:i("Mailing Lists"),url:o.mailing_lists,target:"_blank"},{title:i("Videos"),url:o.screencasts_url,target:"_blank"},{title:i("Wiki"),url:o.wiki_url,target:"_blank"},{title:i("How to Cite Galaxy"),url:o.citation_url,target:"_blank"},{title:i("Interactive Tours"),url:"tours"}]};o.terms_url&&a.menu.push({title:i("Terms and Conditions"),url:o.terms_url,target:"_blank"}),o.biostar_url&&a.menu.unshift({title:i("Ask a question"),url:"biostar/biostar_question_redirect",target:"_blank"}),o.biostar_url&&a.menu.unshift({title:i("Galaxy Biostar"),url:o.biostar_url_redirect,target:"_blank"}),this.add(a);var r={};r=Galaxy.user.id?{id:"user",title:i("User"),cls:"loggedin-only",tooltip:i("Account and saved data"),menu:[{title:i("Logged in as")+" "+Galaxy.user.get("email")},{title:i("Preferences"),url:"user"},{title:i("Custom Builds"),url:"custom_builds"},{title:i("Logout"),url:"user/logout?session_csrf_token="+Galaxy.session_csrf_token,target:"_top",divider:!0},{title:i("Saved Histories"),url:"histories/list",target:"_top"},{title:i("Saved Datasets"),url:"datasets/list",target:"_top"},{title:i("Saved Pages"),url:"pages/list",target:"_top"}]}:o.allow_user_creation?{id:"user",title:i("Login or Register"),cls:"loggedout-only",tooltip:i("Account registration or login"),menu:[{title:i("Login"),url:"user/login",target:"galaxy_main",noscratchbook:!0},{title:i("Register"),url:"user/create",target:"galaxy_main",noscratchbook:!0}]}:{id:"user",title:i("Login"),cls:"loggedout-only",tooltip:i("Login"),url:"user/login",target:"galaxy_main",noscratchbook:!0},this.add(r);var n=this.get(o.active_view);return n&&n.set("active",!0),(new jQuery.Deferred).resolve().promise()}}),Tab:Backbone.View.extend({initialize:function(t){this.model=t.model,this.setElement(this._template()),this.$dropdown=this.$(".dropdown"),this.$toggle=this.$(".dropdown-toggle"),this.$menu=this.$(".dropdown-menu"),this.$note=this.$(".dropdown-note"),this.listenTo(this.model,"change",this.render,this)},events:{"click .dropdown-toggle":"_toggleClick"},render:function(){var t=this;return $(".tooltip").remove(),this.$el.attr("id",this.model.id).css({visibility:this.model.get("visible")&&"visible"||"hidden"}),this.model.set("url",this._formatUrl(this.model.get("url"))),this.$note.html(this.model.get("note")||"").removeClass().addClass("dropdown-note").addClass(this.model.get("note_cls")).css({display:this.model.get("show_note")&&"block"||"none"}),this.$toggle.html(this.model.get("title")||"").removeClass().addClass("dropdown-toggle").addClass(this.model.get("cls")).addClass(this.model.get("icon")&&"dropdown-icon fa "+this.model.get("icon")).addClass(this.model.get("toggle")&&"toggle").attr("target",this.model.get("target")).attr("href",this.model.get("url")).attr("title",this.model.get("tooltip")).tooltip("destroy"),this.model.get("tooltip")&&this.$toggle.tooltip({placement:"bottom"}),this.$dropdown.removeClass().addClass("dropdown").addClass(this.model.get("disabled")&&"disabled").addClass(this.model.get("active")&&"active"),this.model.get("menu")&&this.model.get("show_menu")?(this.$menu.show(),$("#dd-helper").show().off().on("click",function(){$("#dd-helper").hide(),t.model.set("show_menu",!1)})):(t.$menu.hide(),$("#dd-helper").hide()),this.$menu.empty().removeClass("dropdown-menu"),this.model.get("menu")&&(_.each(this.model.get("menu"),function(e){t.$menu.append(t._buildMenuItem(e)),e.divider&&t.$menu.append($("<li/>").addClass("divider"))}),t.$menu.addClass("dropdown-menu"),t.$toggle.append($("<b/>").addClass("caret"))),this},_buildMenuItem:function(t){var e=this;return t=_.defaults(t||{},{title:"",url:"",target:"_parent",noscratchbook:!1}),t.url=e._formatUrl(t.url),$("<li/>").append($("<a/>").attr("href",t.url).attr("target",t.target).html(t.title).on("click",function(i){i.preventDefault(),e.model.set("show_menu",!1),t.onclick?t.onclick():Galaxy.frame.add(t)}))},_toggleClick:function(t){var e=this,i=this.model;if(t.preventDefault(),$(".tooltip").hide(),i.trigger("dispatch",function(t){i.id!==t.id&&t.get("menu")&&t.set("show_menu",!1)}),i.get("disabled")){var l=function(t,e){return $("<div/>").append($("<a/>").attr("href",Galaxy.root+e).html(t)).html()};this.$toggle.popover&&this.$toggle.popover("destroy"),this.$toggle.popover({html:!0,placement:"bottom",content:"Please "+l("login","user/login?use_panels=True")+" or "+l("register","user/create?use_panels=True")+" to use this feature."}).popover("show"),setTimeout(function(){e.$toggle.popover("destroy")},5e3)}else i.get("menu")?i.set("show_menu",!0):i.get("onclick")?i.get("onclick")():Galaxy.frame.add(i.attributes)},_formatUrl:function(t){return"string"==typeof t&&-1===t.indexOf("//")&&"/"!=t.charAt(0)?Galaxy.root+t:t},_template:function(){return'<ul class="nav navbar-nav"><li class="dropdown"><a class="dropdown-toggle"/><ul class="dropdown-menu"/><div class="dropdown-note"/></li></ul>'}})}});
//# sourceMappingURL=../../maps/layout/menu.js.map
