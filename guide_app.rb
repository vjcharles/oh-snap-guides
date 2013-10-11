require 'sinatra'
require 'net/http'
require 'json'

set :bind, '0.0.0.0'

get '/' do
  @guide_guids = params['guide_guids'].split(',') if params['guide_guids']
  @guide_guids ||= ['b995492d5e7943e3b2757a88fe3ef7c6', '0bed6fee853b4f4e966cec0f1210079d']
  erb :guides
end

get '/guide/:uuid.json' do
  get_guide(params[:uuid]).to_json
end

def get_guide(uuid)
  begin
    url = URI.parse('http://snapguide.com/api/v1/guide/' + uuid)
    req = Net::HTTP::Get.new(url.path)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    JSON.parse(res.body)
  rescue JSON::ParserError => e
    JSON.parse('{}')
  end
end
