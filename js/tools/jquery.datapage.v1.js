(function(){
	var debounce = function(func,wait){
		var context,args,result;
		var later = function(){
			result = func.apply(context,args);
			context = args = null;
		}
		return function(){
			context = this;
			args = arguments;
			setTimeout(later,wait);	
		}
		return result;
	}
	var scroll = new IScroll('#wrapper',{click:true,probeType:2}),
		currentPageScroll,
		pullDownStart,
		pageScrollCache = {};
	scroll.on('scrollStart',function(){
		pullDownStart = this.y;
	});
	scroll.on('scroll',function(){
		if(this.y < this.maxScrollY && this.pointY < 1){
			this.scrollTo(0,this.maxScrollY,400);
		}
	});
	scroll.on('scrollEnd',debounce(function(){
			if(Math.abs(this.y - pullDownStart) <= 5 && this.directionY >= 0){
				!currentPageScroll.loadAll && currentPageScroll.next();
			}
		},50)
	);
	function PageScroll(content,pullDown,template,options){
		this.content = content;
		this.pullDown = pullDown;
		this.template = template;
		this.options = {
			pageNo : options.pageNo || 1,
			url : options.url || '',
			data : options.data || {},
			success : this.success.bind(this),
			callback : options.callback
		}
	}
	PageScroll.prototype.success = function(data){
		this.pullDown.removeClass('loading');
		this.pullDown.addClass('loaded');
		this.append(data);
		this.refresh();
		this.options.callback && this.options.callback();
	};
	PageScroll.prototype.next = function(isClear){
		isClear && this.content.html('');
		this.pullDown.removeClass('loadAll');
		this.pullDown.removeClass('loadNothing');
		this.pullDown.removeClass('loaded');
		this.pullDown.addClass('loading')
		this.options.data.pageNo = this.options.pageNo;
		requestUtil.post(this.options);
	};
	PageScroll.prototype.append = function(data){
		if(data.code == "0000" || data.code == "0"){
			//var info = data.info;
			var info = data.data ? data.data : data.result;//data.data.data 是翼农计划列表，data.data.result是新手
			if(info){
				info = info.data ? info.data : (info.result ? info.result : info);
				this.options.pageNo++;
				this.content.append(this.template(info));
				if(info.length < 10){
					this.pullDown.removeClass('loaded');
					this.pullDown.addClass('loadAll');
					this.loadAll = true;
				}
				return;
			}
		}
		this.loadAll = true;
		this.pullDown.removeClass('loaded');
		this.pullDown.addClass('loadAll');
		if(this.options.pageNo === 1){
			this.content.addClass('loadNothing');	
		}
	};
	PageScroll.prototype.refresh = function(){
		window.setTimeout(scroll.refresh.bind(scroll),0);
	};
	window.scrollUtil = {
		addPageScroll : function(name,content,pullDown,template,options){//工厂模式
			var that = this;
			pageScrollCache[name] = new PageScroll(content,pullDown,template,options);
			pullDown.bind('click',that.fetchData.bind(that));
			that.setCurrentPageScroll(name);
		},
		hasAddedPageScroll : function(name){
			return (!!(pageScrollCache[name]));
		},
		refreshScrollData : function(name,new_data,isReSet){
			var ps = pageScrollCache[name] || {};
			ps.content = new_data.content || ps.content;
			ps.template = new_data.template || ps.template;
			ps.pullDown = new_data.pullDown || ps.pullDown;
			var options = new_data.options || {};
			for(var op in options){
				ps.options[op] = options[op];
			}
			isReSet && (ps.loadAll = false);
			pageScrollCache[name] = ps;
		},
		setCurrentPageScroll : function(name){
			currentPageScroll = pageScrollCache[name] || currentPageScroll;
			currentPageScroll.refresh();
		},
		fetchData : function(isClear){
			if(typeof isClear === 'object'){
				isClear = false;
			}
			currentPageScroll && !(currentPageScroll.loadAll) && currentPageScroll.next(isClear);
		}
	};
})();