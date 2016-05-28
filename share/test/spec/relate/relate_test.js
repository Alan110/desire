define(['aladdin/sam_music/relate'],function(relate){
	describe("relate", function() {

		it("init", function() {
			relate.init($());
			console.log(relate);
			expect(5).toEqual(5);
		});
	});
	
});
