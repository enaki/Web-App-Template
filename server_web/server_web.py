import socket
import re


def get_content_type(extension):
	if extension == 'html':
		return "text/html"
	elif extension == 'css':
		return "text/css"
	elif extension == 'js':
		return "application/js"
	elif extension == 'png':
		return "text/png"
	elif extension == 'jpg' or extension == 'jpeg':
		return "text/jpeg"
	elif extension == 'gif':
		return "text/gif"
	elif extension == 'ico':
		return "image/x-icon"


def main():
	# creeaza un server socket
	serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

	serversocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
	# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
	serversocket.bind(('', 5678))
	# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
	serversocket.listen(5)

	while True:
		print('#########################################################################')
		print('Serverul asculta potentiali clienti.')
		# asteapta conectarea unui client la server
		# metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
		(clientsocket, address) = serversocket.accept()
		print('S-a conectat un client.')
		# se proceseaza cererea si se citeste prima linie de text
		cerere = ''
		linieDeStart = ''
		while True:
			data = clientsocket.recv(1024)
			cerere = cerere + data.decode()
			print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
			pozitie = cerere.find('\r\n')
			if (pozitie > -1):
				linieDeStart = cerere[0:pozitie]
				print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
				filename = "../continut" + linieDeStart.split()[1]
				data = open(filename, "rb").read()
				html_response = "HTTP/1.1 200 OK\r\n"
				html_response += "Content-Length: "+str(len(data))+"\r\n"
				html_response += "Content-Type: {}\r\n".format(get_content_type(filename.split('.')[-1]))
				html_response += "Server: server_web.py\r\n\r\n"
				#html_response += data
				clientsocket.sendall(html_response.encode(encoding = 'UTF-8') + data)
				break
		print('S-a terminat citirea.')
		# TODO interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
		# TODO trimiterea răspunsului HTTP
		clientsocket.close()
		print('S-a terminat comunicarea cu clientul.')


if __name__ == '__main__':
	main()