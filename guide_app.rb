require 'sinatra'
require 'net/http'
require 'json'

get '/' do
  @title = "my guides"
  @guides ||= ['b995492d5e7943e3b2757a88fe3ef7c6', 'b995492d5e7943e3b2757a88fe3ef7c6']
  @guides_data =
  erb :guides
end

get '/guide/:uuid.json' do
  get_guide(params[:uuid]).to_json
end

def get_guide(uuid)
  url = URI.parse('http://snapguide.com/api/v1/guide/' + uuid)
  req = Net::HTTP::Get.new(url.path)
  res = Net::HTTP.start(url.host, url.port) {|http|
    http.request(req)
  }
  JSON.parse(res.body)
end
