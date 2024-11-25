require "http/server"
require "ecr/macros"
require "html"

server = HTTP::Server.new do |context|
  request = context.request
  response = context.response

  if request.path == "/" && request.method == "GET"
    policy = request.query_params["policy"]?
    if policy.nil?
      input_value = "default-src 'self'"
    else
      begin
        response.headers["Content-Security-Policy"] = policy
        input_value = HTML.escape policy
      rescue
        input_value = ""
      end
    end
    response.content_type = "text/html; charset=utf-8"
    ECR.embed "src/index.ecr", response
  else
    response.status_code = 404
    response.content_type = "text/plain"
    response.print "Not found"
  end
end

address = server.bind_tcp(3000)
puts "Listening on http://#{address}"

server.listen
